// Lib
import axios, { CancelTokenSource, Method } from 'axios';
import React, { Dispatch, useState } from 'react';
import { useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import { View } from 'react-native';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import uuid from 'react-native-uuid';
// Components
import SettingsContainer from '../../GlobalSettings/Container';
import { ButtonField } from '../../GlobalSettings/Fields';
// import ItemSeparator from '../Commands/ItemSeparator';
// State
// import { themeSelector } from '../../../state/selector';
// Utils
import { encryptPayload } from '../../../utils/aes';
import { requestHandler } from '../../../utils/requestHandler';
// Types
import Device from '../../Devices/Device';
import { MessageAction } from '../../../state/types';
// import { Theme } from '../../../theme';
// Constants
import { UPLOAD_SIZE_LIMIT_MB } from '../../../constants';

type UploadData = {
  id: string;
  name: string;
  data?: string;
  error?: string;
  token: CancelTokenSource;
};

// interface UploadStatusProps {
//   item: UploadData;
//   theme: Theme;
//   onCancel: (name: string) => void;
// }

// const UploadStatus: React.FC<UploadStatusProps> = ({
//   item,
//   theme,
//   onCancel,
// }) => {
//   const styles = StyleSheet.create({
//     container: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       padding: 20,
//     },
//     text: {
//       color: theme.colors.fg,
//       maxWidth: '80%',
//       height: '100%',
//       textAlignVertical: 'center',
//       paddingRight: 20,
//     },
//   });

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>
//         {item.name.length > 70 ? item.name.substr(0, 70) + '...' : item.name}
//       </Text>
//       <Button
//         title="Remove"
//         onPress={() => onCancel(item.id)}
//         color={theme.colors.buttonCancel}
//       />
//     </View>
//   );
// };

// TODO uploading should be done in the background
const FileUpload: React.FC = () => {
  // const [uploads, setUploads] = useState<UploadData[]>([]);
  const [done, setDone] = useState<string[]>([]);

  const { state: device } = useLocation<Device>();
  // const theme = useSelector(themeSelector);
  const messageDispatch = useDispatch<Dispatch<MessageAction>>();

  const createUpload = async (
    info: DocumentPickerResponse,
  ): Promise<UploadData> => {
    return new Promise(async resolve => {
      const upload: UploadData = {
        id: uuid.v4() as string,
        name: info.name,
        data: '',
        token: axios.CancelToken.source(),
      };

      // * Android, RNFS or Aes cant handle files bigger than ~8MB
      if (info.size > UPLOAD_SIZE_LIMIT_MB * 1000000) {
        upload.error = `File too big, limit is ${UPLOAD_SIZE_LIMIT_MB}MB.\n${info.name}`;
        resolve(upload);
      }

      upload.data = await RNFS.readFile(info.uri, {
        encoding: 'base64',
      });

      const encrypted = await encryptPayload(
        JSON.stringify(upload),
        device.password,
      );

      resolve({
        ...upload,
        data: encrypted,
      });
    });
  };

  const pickFiles = async () => {
    try {
      const fileInfos = await DocumentPicker.pickMultiple();

      const uploadDataPromises = fileInfos.map(info => createUpload(info));

      const uploadDataObjects = await Promise.all(uploadDataPromises);

      const validUploads = uploadDataObjects.filter(u => !u.error);

      // setUploads(validUploads);

      const uploadPromises = validUploads.map(v => uploadFile(v));

      uploadDataObjects
        .filter(o => o.error)
        .map(f =>
          messageDispatch({
            type: 'ADD_MESSAGE',
            value: f.error ? f.error : `Creating upload from ${f.name} failed`,
          }),
        );

      await Promise.all(uploadPromises);
    } catch (error) {
      const err = error as Error;

      if (err.message === 'User canceled document picker' || !err.message) {
        return;
      }

      messageDispatch({
        type: 'ADD_MESSAGE',
        value: err.message,
      });
    }
  };

  const uploadFile = async (upload: UploadData) => {
    const formData = new FormData();

    formData.append('upload', upload.data);

    const request = {
      path: '/api/upload',
      method: 'POST' as Method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      cancelToken: upload.token,
      data: formData,
      device: device,
    };

    await requestHandler(request);

    setDone(done.concat(upload.id));
  };

  // const handleCancel = (id: string) => {
  //   const item = uploads.find(u => u.id === id);

  //   if (!item) {
  //     return;
  //   }

  //   item.token.cancel();

  //   setUploads(uploads.filter(d => d.id !== item.id));
  // };

  return (
    <View>
      <SettingsContainer text="Upload">
        <ButtonField text="Select file(s)" onPress={pickFiles} />
      </SettingsContainer>
      {/* <SettingsContainer text="Transfers">
        {uploads.length > 0 && (
          <FlatList
            data={uploads}
            keyExtractor={item => item.id}
            ListHeaderComponent={ItemSeparator}
            ItemSeparatorComponent={ItemSeparator}
            ListFooterComponent={ItemSeparator}
            renderItem={({ item }) => (
              <UploadStatus item={item} theme={theme} onCancel={handleCancel} />
            )}
          />
        )}
      </SettingsContainer> */}
    </View>
  );
};

export default FileUpload;
