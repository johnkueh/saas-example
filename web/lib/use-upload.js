import config from '../app.config';

export const useUpload = () => {
  return {
    openWidget: ({ onUpload } = {}) => {
      cloudinary.openUploadWidget(widgetOptions, onEvent.bind(this, onUpload));
    }
  };
};

export const onEvent = (callback, err, info) => {
  if (!err)
    if (info.event === 'success') {
      const {
        info: { public_id }
      } = info;
      callback(public_id);
    }
};

const widgetOptions = {
  cloudName: config.CLOUDINARY_CLOUD_NAME,
  uploadPreset: config.CLOUDINARY_UPLOAD_PRESET,
  sources: ['local', 'url', 'camera', 'image_search', 'facebook', 'dropbox', 'instagram'],
  showAdvancedOptions: false,
  // cropping: true,
  multiple: true,
  defaultSource: 'local',
  styles: {
    palette: {
      window: '#FFFFFF',
      windowBorder: '#95A5A6',
      tabIcon: '#007BFF',
      menuIcons: '#5A616A',
      textDark: '#2C3E50',
      textLight: '#FFFFFF',
      link: '#007BFF',
      action: '#E67E22',
      inactiveTabIcon: '#BDC3C7',
      error: '#E74C3C',
      inProgress: '#007BFF',
      complete: '#2ECC71',
      sourceBg: '#ECF0F1'
    },
    fonts: {
      default: null,
      'system-ui, sans-serif': {
        url: null,
        active: true
      }
    }
  }
};

export default {
  useUpload,
  onEvent,
  widgetOptions
};
