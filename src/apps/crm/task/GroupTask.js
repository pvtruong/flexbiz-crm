import React,{Component} from 'react';
import {withRouter} from 'react-router-dom';
import withMediaQuery from "flexbiz-core/components/withMediaQuery";
import Container from '../Container';
import GroupTask from 'flexbiz-core/components/task/GroupTask';
import Breadcrumbs from "flexbiz-core/components/Breadcrumbs";
import Typography from '@material-ui/core/Typography';
//import {getLabel} from "../../../API";
import PropTypes from 'prop-types';
import AuthContext from "flexbiz-core/components/auth/Context";
class ListPage extends Component{
  render(){
    let height = (this.props.mediaQueryMatches?"calc(100vh - 45px - 55px)":"calc(100vh - 65px - 60px)");
    let paths = [];
    let module_name = this.props.match.params.module;
    if(module_name){
        paths.push({to:"/m/" + module_name,title: this.context.apis.getLabel(module_name)})
    }

    paths.push({
        title:this.context.apis.getLabel("Nhóm công việc")
    })
    return (
      <Container requireLogin {...this.props}  onSearch={(q)=>this._groupTask.search(q)} placeholderSearch ={this.context.apis.getLabel("Tìm nhóm công việc...")}>
            <div style={{padding:10,display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                <Breadcrumbs info={{paths}}/>
                <Typography color="textPrimary">
                  <span id="view-title-container"></span>
                </Typography>
            </div>
            <div style={{overflow:"hidden",marginLeft:(this.props.mediaQueryMatches?0:10),marginRight:(this.props.mediaQueryMatches?0:10),marginBottom:(this.props.mediaQueryMatches?0:10),height:height}}  elevation={this.props.mediaQueryMatches?0:1}>
                <GroupTask {...this.props} defaultCondition={{status:true}} ref={ref=>this._groupTask=ref}  style={{height:"100%"}} />
            </div>
      </Container>
    )
  }
}
ListPage.contextType = AuthContext;
ListPage.propTypes={
  mediaQueryMatches: PropTypes.bool,
  match: PropTypes.any,
}
export default  withRouter(withMediaQuery('(max-width:480px)')(ListPage));