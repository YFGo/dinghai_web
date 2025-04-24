import { Layout, Row, Col, Card, Typography } from 'antd';
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts'
import 'echarts-gl';
import './style.scss';
// var ROOT_PATH = 'https://echarts.apache.org/examples'

import earth from '@/assets/img/earth.jpg'
import starfield from '@/assets/img/starfield.jpg'


const { Content } = Layout;
const { Title } = Typography;

export default function Dashboard() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      const option = {
        globe: {
          baseTexture: earth,
          shading: 'lambert',
          environment: starfield,
          atmosphere: {
            show: true
          },
          light: {
            ambient: {
              intensity: 0.1
            },
            main: {
              intensity: 1.5
            }
          }
        }
      }
      chart.setOption(option);      
      console.log("初始化成功");  
    }
  }, []);

  return (
    <Layout className="dashboard-layout">
      <Content style={{ padding: '24px' }}>
        <Row gutter={24}>
          <Col span={16}>
            <div ref={chartRef} className="chart-container" />
          </Col>
          
          <Col span={8}>
            <Card title="实时拦截统计" className="stats-card">
              <div className="stat-item">
                <Title level={5}>全球攻击总数</Title>
                <Title level={2}>1,234,567</Title>
              </div>
              <div className="stat-item">
                <Title level={5}>今日拦截次数</Title>
                <Title level={2}>23,456</Title>
              </div>
              <div className="stat-item">
                <Title level={5}>高危攻击数量</Title>
                <Title level={2} type="danger">1,234</Title>
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}