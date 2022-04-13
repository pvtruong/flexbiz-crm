import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import {withRouter} from 'react-router-dom';
import AuthContext from "flexbiz-core/components/auth/Context";
import withMediaQuery from "flexbiz-core/components/withMediaQuery";
import queryString from 'query-string';
import {isEqual as equal} from 'lodash';
import RequireLogin from "flexbiz-core/components/RequireLogin";
class List extends React.Component{
  constructor(props){
    super(props);
    this.state={
    }
    this.search = this.search.bind(this);
  }
  async componentDidMount( ) {
    const {default:InputBase} = await import("flexbiz-core/components/InputBase");
    this.setState({
      InputBase:InputBase
    },()=>{
        this.loadListInfo();
    })
  }
  shouldComponentUpdate(nextProps){
    if(this.state.listInfo &&  this.state.listInfo.code ===nextProps.match.params.code){
      return false;
    }
    return true;
  }
  async componentDidUpdate(prevProps){
    if(!equal(prevProps.match.params.code,this.props.match.params.code)){
      this.loadListInfo();
    }
  }
  search(q){
    if(this._list){
      this._list.search(q)
    }
  }
  async loadListInfo(){
    const code= this.props.match.params.code;
    this.context.setProgressStatus(true);
    try{
      let listInfo = await this.context.apis.asyncGetData(this.context.userInfo.token,"listinfo",{code:code.toLowerCase()},null,true);
      if(listInfo){
        let defaultCondition = queryString.parse(this.props.location.search);
        this.setState({code:code,listInfo:listInfo,defaultData:defaultCondition,defaultCondition:defaultCondition});
        if(this.props.onInit){
          this.props.onInit(listInfo)
        }
      }else{
        this.context.setProgressStatus(false);
        this.props.history.push(`/404`);
      }
    }catch(e){
      console.error(e)
      this.context.alert(e.message||e);
      this.props.history.push(`/404`);
    }
  }
  render(){
    let height = (this.props.mediaQueryMatches?"100%":"calc(100vh - 20px)");
    return (
      <>
        <Paper  style={{margin:this.props.mediaQueryMatches?0:0,marginTop:0,padding:0,overflow:"hidden"}}>
          {this.state.listInfo && this.state.listInfo.code===this.props.match.params.code &&
            <this.state.InputBase
              fullScreen={this.props.mediaQueryMatches}
              style={{padding:10,height:height}}
              listInfo={this.state.listInfo}
              code={this.state.code}
              title={this.state.listInfo.title}
              defaultData={this.state.defaultData}
              defaultCondition={this.state.defaultCondition}
              defaultOptionsCode="default_list_options" optionsFormCode={`${this.state.listInfo.code.toLowerCase()}_options`} 
              ref={ref=>this._list = ref}
              {...this.props}/> }
      </Paper>
    </>)
  }
}
List.contextType = AuthContext;
List.propTypes={
  match: PropTypes.any,
  history: PropTypes.any,
  location: PropTypes.any,
  mediaQueryMatches: PropTypes.bool,
  onInit:PropTypes.func
}

class ListPage extends React.PureComponent{
  constructor(props){
    super(props);
    this.state={
      placeholderSearch:""
    }
  }
  render(){
    return (
      <RequireLogin {...this.props}>
        <List {...this.props} ref={ref=>this._list = ref}   onInit={(info)=>{
          this.setState({placeholderSearch:`${this.context.apis.getLabel(info.title)}: ${this.context.apis.getLabel("Tìm...")}`})
        }}/>
      </RequireLogin>
    )
  }
}
ListPage.contextType = AuthContext;
export default  withRouter(withMediaQuery('(max-width:480px)')(ListPage));