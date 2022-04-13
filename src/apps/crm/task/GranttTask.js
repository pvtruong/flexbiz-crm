import React,{Component} from 'react';
import {withRouter} from 'react-router-dom';
import withMediaQuery from "flexbiz-core/components/withMediaQuery";
import Container from '../Container';
import GranttTask from 'flexbiz-core/components/task/GranttTask';
import Breadcrumbs from "flexbiz-core/components/Breadcrumbs";
import AuthContext from "flexbiz-core/components/auth/Context";
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
class ListPage extends Component{
  render(){
    let module_name = this.props.match.params.module;
    let paths = [];
    if(module_name){
        paths.push({to:"/m/" + module_name,title: this.context.apis.getLabel(module_name)})
    }
    return (
      <Container requireLogin {...this.props}>
        <div style={{padding:10}}>
            <Breadcrumbs  info={{paths:paths}}/>
        </div>
        <Paper style={{overflow:"hidden",marginLeft:10,marginRight:10,marginBottom:10,height:(this.props.mediaQueryMatches?"100%":"calc(100vh - 65px - 65px)")}}>
          <GranttTask {...this.props} />
        </Paper>
      </Container>
    )
  }
}
ListPage.contextType = AuthContext;
ListPage.propTypes={
  mediaQueryMatches: PropTypes.bool,
}
export default  withRouter(withMediaQuery('(max-width:480px)')(ListPage));
