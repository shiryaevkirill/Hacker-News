import { Layout, Space, Typography } from 'antd';
const { Header, Content } = Layout;
const { Title } = Typography;

const headerStyle = {
  textAlign: 'center',
  color: '#000',
  height: 120,
  paddingInline: 50,
  lineHeight: '120px',
  backgroundColor: '#ff6600',
};
const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#f6f6ef',
};
const MainLayout = ({content}) => (
  <Space
    direction="vertical"
    style={{
      width: '100%',
    }}
    size={[0, 48]}
  >
    <Layout>
      <Header style={headerStyle}><Title>Hacker News</Title></Header>
      <Content style={contentStyle}>{content}</Content>
    </Layout>
  </Space>
);
export default MainLayout;