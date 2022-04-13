import React,{PureComponent} from 'react';
import {withRouter} from 'react-router-dom';
import withMediaQuery from "flexbiz-core/components/withMediaQuery";
import OrkDiagram from "flexbiz-core/components/okr/OkrDiagram";
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
      {to:`/module/Quản%20lý%20OKRs`,title:"Quản lý OKRs"}
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
        <OrkDiagram {...this.props} idLink={this.id_link} title ={this.title} />
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
