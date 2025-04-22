import { useState } from 'react';
import { Form, Input, Button, Tabs, Card, message, Layout } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import './style.scss';

const { Content } = Layout;

interface LoginFormValues {
  username: string;
  password: string;
}

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      // 模拟登录请求
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (values.username === 'admin' && values.password === '123456') {
        message.success('登录成功！');
      } else {
        message.error('账号或密码错误！');
      }
    } catch (error) {
      console.log(error);
      
      message.error('登录失败，请稍后再试！');
    } finally {
      setLoading(false);
    }
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '账号登录',
      children: (
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入账号!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="邮箱/手机号"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              立即登录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '2',
      label: '手机登录',
      children: (
        <Form size="large">
          <Form.Item
            name="phone"
            rules={[{ required: true, message: '请输入手机号!' }]}
          >
            <Input placeholder="手机号" />
          </Form.Item>

          <Form.Item
            name="smsCode"
            rules={[{ required: true, message: '请输入验证码!' }]}
          >
            <div style={{ display: 'flex', gap: 16 }}>
              <Input placeholder="短信验证码" />
              <Button>获取验证码</Button>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" block>
              立即登录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <Layout className="login-container">
      <Content className="login-content">
        <Card
          title="定海网安平台"
          className="login-card"
          styles={{
            title: { textAlign: 'center' },
          }}
        >
          <Tabs
            activeKey={activeTab}
            items={items}
            onChange={setActiveTab}
            centered
            tabBarStyle={{ width: '100%' }}
          />

          <div className="additional-links">
            <Button type="link">忘记密码</Button>
            <Button type="link">立即注册</Button>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default Login;