import React,{Component} from 'react';
import {withRouter} from 'react-router-dom';
import Container from './Container';
import AuthContext from "flexbiz-core/components/auth/Context";
import withMediaQuery from "flexbiz-core/components/withMediaQuery";
import PropTypes from 'prop-types';
class Home extends React.Component{
  constructor(props){
    super(props);
    this.state={
    }
  }
  async componentDidMount(){
    const {default:DashboardComponent} = await import("flexbiz-core/components/dashboard/Dashboard");
    this.setState({
      DashboardComponent:DashboardComponent
    })
  }
  render(){
    return (
      <AuthContext.Consumer>
        {({menu,userInfo,appInfo})=>{
          if(!menu || menu.length===0 || !userInfo || !appInfo) return null;
          return (
            <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
              {!!this.state.DashboardComponent &&
                    <this.state.DashboardComponent {...this.props} id="CRM"/>}
            </div>
          )
        }}
      </AuthContext.Consumer>
    )
  }
}
Home.contextType = AuthContext;
Home.propTypes={
  mediaQueryMatches: PropTypes.bool,
  history:PropTypes.any,
}
class HomePage extends Component{
  render(){
    return (
      <Container {...this.props} showDrawerIfIsDesktop={false} requireLogin>
        <Home {...this.props} />
      </Container>
    )
  }
}
export default  withRouter(withMediaQuery('(max-width:480px)')(HomePage));
