import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function Page500() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您无权访问此页面。"
        extra={[
          <Button
            type="primary"
            key="back"
            onClick={() => navigate('/dashboard')}
          >
            返回首页
          </Button>,
        ]}
      />
    </div>
  );
}