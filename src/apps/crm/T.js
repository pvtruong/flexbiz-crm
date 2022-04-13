import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import AuthContext from "flexbiz-core/components/auth/Context";
import config from "./config";
class T extends React.Component{
  constructor(props){
    super(props);
    this.state={
    }
  }
  async componentDidMount( ) {
    const code= this.props.match.params.code;
    let m = config.menu.find(m=>m.code.toLowerCase()===code.toLowerCase());
    if(m){
        this.props.history.replace(`/m/${m.group}${m.path}`);
    }else{
        this.props.history.replace("/404");
    }
  }
  render(){
    return null;
  }
}
T.contextType = AuthContext;
T.propTypes={
  match: PropTypes.any,
  history: PropTypes.any,
  location: PropTypes.any,
}
export default  withRouter(T);
