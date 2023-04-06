import React, { Component, Fragment } from 'react';
import { observer } from "mobx-react"
import {Link} from 'react-router-dom';
import withRouter from '../utils/withRouter';
import timeConverter from '../utils/timeConverter';
import DOMPurify from 'dompurify'
import {Divider, Button, Card, Col,Row, Space,Typography } from 'antd';
const { Text} = Typography;
 
@observer class NewsPage extends Component{
    
    addChildrenComments = (id) => {this.props.store.setComments(id)};

    removeChildrenComments = (id) => {this.props.store.removeComments(id)};

    commentsRow = ({com}) =>{
      return(
        <Fragment>
          <Space.Compact size='small' direction="vertical" style={{display: 'flex'}}>
          <Text style={{fontSize: 'middle',textAlign: 'left'}}>
            {com.level !=0 && <li key={com.key} style={{marginLeft: `${(com.level-1)*30}px`}} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(com.value.text)}}/>}
          </Text>
          {com.level>0 && com.value?.kids?.length>0 && !com.opened ?
            <Button type='text' size='small' style={{marginLeft: `${(com.level-1)*30}px`}} 
              onClick={() => this.addChildrenComments(com.key)} className={com.key} >Read more</Button>
          : com.level>0 && com.value?.kids?.length>0 && com.opened && 
            <Button type='text' size='small' style={{marginLeft: `${(com.level-1)*30}px`}} 
              onClick={() => this.removeChildrenComments(com.key)} className={com.key} >Hide</Button>}
          < Divider/>
          </Space.Compact>
        </Fragment>
      );
    }

    back = () => {
      this.props.store.setCurrentId(-1);
    }

    refreshComments = () => {
      this.props.store.refreshComments();
    }


    render(){
      const {store} = this.props;
      const {id} = this.props.params;

      const data = store.getPageData(+id);
      store.setCurrentId(+id);
      return(
        <Fragment>
          <Row>
            <Col span={3}><div><Link to='/'><Button onClick={() => this.back()}>Back</Button></Link></div></Col>
            <Col span={12}>
            <Space direction="vertical" size={16}>
              <Card
                title={data.title}
                style={{
                  textAlign: 'left',
                }}
                >
                  <p>{`By: ${data.by}`}</p>
                  <p>Url: <a>{data.url}</a></p>
                  <p>{`Points: ${data.score}`}</p>
                  <p>{`Publication date: ${timeConverter(data.time)}`}</p>
                  <p>{`Comments: ${data.descendants}`}</p>
              </Card>
              </Space>
              <div><Button onClick={() => this.refreshComments()}>Refresh</Button></div>
            </Col>
            <Col span={9}></Col>
          </Row>
          <Row>
            <Col span={3}></Col>
            <Col span={18}>
              <div>
                <ul>
                  {[...store.comments_tree.preOrderTraversal()].map((node) => <this.commentsRow com={node} /> )}
                </ul>
              </div>
            </Col>
            <Col span={3}></Col>
          </Row>          
        </Fragment>
      );
    };
  }
 
export default withRouter(NewsPage);