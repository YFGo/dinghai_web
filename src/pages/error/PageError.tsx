import { Button, Result } from 'antd';
import { useLocation } from 'react-router-dom';
import { useRouter } from '@/router/hooks/use-router'

export default function PageError() {
  const router = useRouter()
  const location = useLocation();
  
  // 从路由state获取错误信息，带默认值
  const { errorCode = 'error', errorMessage = '发生未知错误' } = location.state || {};

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Result
        status={errorCode === 403 ? '403' : errorCode === 404 ? '404' : 'error'}
        title={errorCode}
        subTitle={errorMessage}
        extra={[
          <Button
            color="primary"
            key="back"
            onClick={() => router.back()}
          >
            返回上一页
          </Button>
        ]}
      />
    </div>
  );
}