import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import AuthContext from "flexbiz-core/components/auth/Context";
import withMediaQuery from "flexbiz-core/components/withMediaQuery";
import RequireLogin from "flexbiz-core/components/RequireLogin";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Typography from '@material-ui/core/Typography';
class Checkin extends React.Component{
  constructor(props){
    super(props);
  }
  async componentDidMount( ) {
  }
  render(){
    return (
      <div style={{width:"100%",height:"calc(100vh)",overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
        
        {!!this.context.appInfo && !!this.context.appInfo.logo &&
          <LazyLoadImage src={`${this.context.config.server_url}${this.context.appInfo.logo}?access_token=${this.context.userInfo.token}`} style={{maxWidth:"80%",maxHeight:"50%"}}/>
        }

        <Typography variant="h1" style={{textAlign:"center",padding:20}}>
          CHECK-IN
        </Typography>
      </div>
    )
  }
}
Checkin.contextType = AuthContext;
Checkin.propTypes={
  match: PropTypes.any,
  history: PropTypes.any,
  location: PropTypes.any,
  mediaQueryMatches: PropTypes.bool,
}
class CheckinPage extends Component{
  render(){
    return (
      <RequireLogin>
        <Checkin {...this.props} />
      </RequireLogin>
    )
  }
}
export default  withRouter(withMediaQuery('(max-width:480px)')(CheckinPage));
