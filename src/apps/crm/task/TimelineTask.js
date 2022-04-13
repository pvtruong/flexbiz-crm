import React,{Component} from 'react';
import {withRouter} from 'react-router-dom';
import withMediaQuery from "flexbiz-core/components/withMediaQuery";
import Container from '../Container';
import TimelineTask from 'flexbiz-core/components/task/TimelineTask';
import Breadcrumbs from "flexbiz-core/components/Breadcrumbs";
import AuthContext from "flexbiz-core/components/auth/Context";
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
class ListPage extends Component{
  render(){
    let paths = [];
    let module_name = this.props.match.params.module;
    if(module_name){
        paths.push({to:"/m/" + module_name,title: this.context.apis.getLabel(module_name)})
    }

    paths.push({
        title:this.context.apis.getLabel("Timeline thực hiện")
    })
    return (
      <Container requireLogin {...this.props}>
        <div style={{padding:10}}>
            <Breadcrumbs info={{paths}}/>
        </div>
        <Paper style={{overflow:"auto",margin:10,height:(this.props.mediaQueryMatches?"100%":"calc(100vh - 65px - 65px)")}}>
          <TimelineTask {...this.props} />
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
