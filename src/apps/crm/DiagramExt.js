import React,{Component} from 'react';
import {withRouter} from 'react-router-dom';
import AuthContext from "flexbiz-core/components/auth/Context";
import withMediaQuery from "flexbiz-core/components/withMediaQuery";
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import Frag from "flexbiz-core/components/Frag";
import RequireLogin from "flexbiz-core/components/RequireLogin";
class Diagram extends React.Component{
  constructor(props){
    super(props);
    this.state={
    }
    this.setting = this.setting.bind(this);
  }
  async componentDidMount(){
    const {default:Diagram} = await import("flexbiz-core/components/diagram");
    this.setState({
      Diagram:Diagram
    })
  }
  setting(){
    if(this.refDiagram) this.refDiagram.setting();
  }
  render(){
    let height = (this.props.mediaQueryMatches?"100%":"calc(100vh - 20px)");
    return (
      <>
        <Frag  style={{margin:this.props.mediaQueryMatches?0:0,marginTop:0,padding:0,overflow:"hidden"}} actions={
          <IconButton size="small" onClick={this.setting}><SettingsIcon/></IconButton>
        }>
          {this.state.Diagram &&
            <this.state.Diagram {...this.props} style={{height:height}} ref={ref=>this.refDiagram = ref}/> }
        </Frag>
    </>)
  }
}
Diagram.contextType = AuthContext;
Diagram.propTypes={
  match: PropTypes.any,
  history:PropTypes.any,
  mediaQueryMatches: PropTypes.bool,
}
class DiagramPage extends Component{
  constructor(props){
    super(props);
    this.id = this.props.match.params.id;
  }
  render(){
    return (
      <RequireLogin {...this.props}>
        <Diagram {...this.props} id={this.id} showTitle />
      </RequireLogin>
    )
  }
}
DiagramPage.propTypes={
  match:PropTypes.any,
}
export default  withRouter(withMediaQuery('(max-width:480px)')(DiagramPage));
