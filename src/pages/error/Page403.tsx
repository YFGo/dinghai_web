import { Button, Result } from 'antd';
import { useRouter } from '@/router/hooks/use-router'

export default function Page403() {
  const router = useRouter()

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
            onClick={() => router.push('/dashboard')}
          >
            返回首页
          </Button>,
        ]}
      />
    </div>
  );
}