import { useState } from 'react';
import { Form, Input, Button, Tabs, Card, message, Layout } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import { authApi } from '@/api/modules/user'; // 导入封装好的接口
import type { LoginParams } from '@/api/types'; // 导入类型定义
import './style.scss';

const { Content } = Layout;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [form] = Form.useForm();

  // 统一处理登录逻辑
  const handleLogin = async (values: any) => {
    try {
      setLoading(true);

      let params: LoginParams;

      // 根据登录方式构造参数
      if (activeTab === '1') { // 账号登录
        params = {
          login_method: values.username.includes('@') ? 2 : 3,
          [values.username.includes('@') ? 'email' : 'phone']: values.username,
          password: values.password
        };
      } else { // 手机登录
        params = {
          login_method: 1,
          phone: values.phone,
          code: values.smsCode
        };
      }

      // 调用接口
      const { data: tokens } = await authApi.login(params);

      // 存储Token
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);

      // 获取用户信息
      const { data: userInfo } = await authApi.getUserInfo();

      message.success(`欢迎回来，${userInfo.name}`);
      // 这里应该跳转到主页

    } catch (error) {
      message.error(error instanceof Error ? error.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理验证码获取
  const handleGetCode = async () => {
    try {
      const phone = form.getFieldValue('phone');
      if (!phone) {
        message.warning('请输入手机号');
        return;
      }

      await authApi.sendSmsCode({ phone });
      message.success('验证码已发送');
      // 这里可以添加倒计时逻辑
    } catch (error) {
      message.error('验证码发送失败');
      console.log(error);
      
    }
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '账号登录',
      children: (
        <Form
          form={form}
          onFinish={handleLogin}
          size="large"
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入邮箱或手机号' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="邮箱/手机号"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
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
        <Form
          form={form}
          onFinish={handleLogin}
          size="large"
        >
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误' }
            ]}
          >
            <Input
              prefix={<MobileOutlined />}
              placeholder="手机号"
            />
          </Form.Item>

          <Form.Item
            name="smsCode"
            rules={[
              { required: true, message: '请输入验证码' },
              { pattern: /^\d{6}$/, message: '6位数字验证码' }
            ]}
          >
            <div style={{ display: 'flex', gap: 16 }}>
              <Input placeholder="短信验证码" />
              <Button onClick={handleGetCode}>获取验证码</Button>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
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
            header: { border: 0 },
            title: {
              fontSize: 24,
              fontWeight: 500,
              textAlign: 'center',
              width: '100%'
            }
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