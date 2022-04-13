import React,{PureComponent} from 'react';
import {withRouter} from 'react-router-dom';
import withMediaQuery from "flexbiz-core/components/withMediaQuery";
import Container from './Container';
import ChatList from 'flexbiz-core/components/ChatList';
import PropTypes from 'prop-types';
import AuthContext from "flexbiz-core/components/auth/Context";
import queryString from "query-string";
class ListPage extends PureComponent{
  constructor(props){
    super(props);
    this.state={}
  }
  render(){
    let query = queryString.parse(this.props.location.search);
    let height = (this.props.mediaQueryMatches?"calc(100vh - 45px)":"calc(100vh - 65px)");
    return (
      <Container requireLogin  showDrawerIfIsDesktop={false} {...this.props}   onSearch={(q)=>this._chatList.search(q)} placeholderSearch ={this.context.apis.getLabel("Tìm nhóm thảo luận...")}>
        <div style={{overflow:"hidden",height:height}}  elevation={this.props.mediaQueryMatches?0:1}>
            <ChatList {...this.props} ref={ref=>this._chatList=ref} style={{height:"100%"}} groupId={query.id_link} />
        </div>
      </Container>
    )
  }
}
ListPage.contextType = AuthContext;
ListPage.propTypes={
  location:PropTypes.any,
  mediaQueryMatches: PropTypes.bool,
}
export default  withRouter(withMediaQuery('(max-width:900px)')(ListPage));