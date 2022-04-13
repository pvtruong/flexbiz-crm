import React,{PureComponent} from 'react';
import {withRouter} from 'react-router-dom';
import withMediaQuery from "flexbiz-core/components/withMediaQuery";
import StrategicDiagram from "flexbiz-core/components/strategic/StrategicDiagram";
import Container from '../Container';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import Breadcrumbs from "flexbiz-core/components/Breadcrumbs";
class ListPage extends PureComponent{
  constructor(props){
      super(props);
      const query = queryString.parse(this.props.location.search);
      this.id_link = this.props.match.params.id_link;
      this.title = query.title;
  }
  render(){
    let paths = [
      {to:`/module/Quản%20lý%20chiến%20lược`,title:"Quản lý chiến lược"},
      {to:"/list/strategicdiagram",title: 'Diagram kế hoạch chiến lược'}
    ]
    if(this.title){
      paths.push({
        title:this.title
      })
    }
    return (
      <Container requireLogin {...this.props}  showDrawerIfIsDesktop={false}>
        <div elevation={0} style={{padding:10}}>
            <Breadcrumbs info={{paths:paths}}/>
        </div>
        <StrategicDiagram {...this.props} idLink={this.id_link} title ={this.title} />
      </Container>
    )
  }
}
ListPage.propTypes={
    match: PropTypes.any,
    history: PropTypes.any,
    location: PropTypes.any,
    mediaQueryMatches: PropTypes.bool,
  }
export default  withRouter(withMediaQuery('(max-width:480px)')(ListPage));
