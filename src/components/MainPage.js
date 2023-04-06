import React, {Component, Fragment} from 'react';
import { observer } from "mobx-react";
import timeConverter from '../utils/timeConverter';
import {Link} from 'react-router-dom';
import { Descriptions, Row, Col, Divider,Button} from 'antd';




@observer class MainPage extends Component{
  
    Row = ({key,data}) =>{    
      return(
        <Fragment>
            <li key={key} class="news">
            <Link to = {`/news-page/${data.id}`}>
            <Descriptions title={data.title}>
                <Descriptions.Item label="By">{data.by}</Descriptions.Item>
                <Descriptions.Item label="Points">{data.score}</Descriptions.Item>
                <Descriptions.Item label="Publication date">{timeConverter(data.time)}</Descriptions.Item>
            </Descriptions>
            </Link>
            </li>
            <Divider/>
        </Fragment>);
    };
  
    refresh = () => {this.props.store.refresh()}; 
  
    render(){
      const {store} = this.props; 
      return(
        <div>
          <Button onClick={() => this.refresh()}>Refresh</Button>
          <Row>
          <Col span={6}></Col>
          <Col span={12}>
          <ul>
            {store.newsData.map((news) => <this.Row key={news.id} data={news}/>)}
          </ul>
          </Col>
          <Col span={6}></Col>
          </Row>
        </div>
      );
    }
  
  }

  export default MainPage;