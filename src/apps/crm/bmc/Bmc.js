import React,{PureComponent} from 'react';
import {withRouter} from 'react-router-dom';
import withMediaQuery from "flexbiz-core/components/withMediaQuery";
import BmcWidget from "flexbiz-core/components/bmc/BmcWidget";
import Container from '../Container';
import PropTypes from 'prop-types';
import Breadcrumbs from "flexbiz-core/components/Breadcrumbs";
import AuthContext from "flexbiz-core/components/auth/Context";
class ListPage extends PureComponent{
  constructor(props){
      super(props);
      this.id = this.props.match.params.id;
  }
  render(){
    let paths = [
      {to:`/list/bmc`,title:this.context.apis.getLabel("Dạnh sách mô hình kinh doanh")}
    ]
    return (
      <Container requireLogin {...this.props}  showDrawerIfIsDesktop={false}>
        <div elevation={0} style={{padding:10}}>
            <Breadcrumbs info={{paths:paths}}/>
        </div>
        <BmcWidget {...this.props} id={this.id} />
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
ListPage.contextType = AuthContext;
export default  withRouter(withMediaQuery('(max-width:480px)')(ListPage));
