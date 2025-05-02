import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { Provider } from 'react-redux';
import Router from '@/router/index'
import store from '@/redux/index.ts';
import './global.css'

const App = () => {
  return (
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <Router/>
      </ConfigProvider>
    </Provider>
  );
};

export default App
