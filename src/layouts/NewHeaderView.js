/**
 * 重写顶部布局组件
 * 
*/
import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import { Layout, message,Menu ,Icon,} from 'antd';
import Animate from 'rc-animate';
import { connect } from 'dva';
import router from 'umi/router';
import GlobalHeader from '@/components/GlobalHeader';
import TopNavHeader from '@/components/TopNavHeader';
import styles from './Header.less';
import Authorized from '@/utils/Authorized';
import {findMenuByUrl, getParentId,jsonToTreeJson,getChiledByMenuIndex} from "../utils/treeutil";
import { routerRedux } from 'dva/router';

const SubMenu = Menu.SubMenu;
const { Header } = Layout;

class NewHeaderView extends PureComponent {
    TAG="NewHeaderView:";
    state = {
        visible: true,
        topMenuData:null,
        pathname:"",
    };

    static getDerivedStateFromProps(props, state) {
        if (!props.autoHideHeader && !state.visible) {
            return {
                visible: true,
            };
        }
        return null;
    } 

    componentDidMount() {
        document.addEventListener('scroll', this.handScroll, { passive: true });
        const { dispatch, location: { pathname } } = this.props; 
        dispatch({
            type: "testModel/getMenuData",
            callback: (data) => {
                const superMenuRoot = getParentId(data, pathname);
                if(superMenuRoot){
                    this.setState({
                        topMenuData: data,
                        current: superMenuRoot.id,
                    });
                    if(pathname.length>1){
                        let param = {key:superMenuRoot.id,url:pathname};
                        dispatch({
                            type: "testModel/curClickKey",
                            payload: param, 
                        });
                    }
                }
            }
        });
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.handScroll);
    }

    getHeadWidth = () => {
        const { isMobile, collapsed, setting } = this.props;
        const { fixedHeader, layout } = setting;
        if (isMobile || !fixedHeader || layout === 'topmenu') {
            return '100%';
        }
        return collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)';
    };

    handleNoticeClear = type => {
        message.success(
            `${formatMessage({ id: 'component.noticeIcon.cleared' })} ${formatMessage({
                id: `component.globalHeader.${type}`,
            })}`
        );
        const { dispatch } = this.props;
        dispatch({
            type: 'global/clearNotices',
            payload: type,
        });
    };

    handleMenuClick = ({ key }) => {
        const { dispatch } = this.props;
        if (key === 'userCenter') {
            router.push('/account/center');
            return;
        }
        if (key === 'triggerError') {
            router.push('/exception/trigger');
            return;
        }
        if (key === 'userinfo') {
            router.push('/account/settings/base');
            return;
        }
        if (key === 'logout') {
            dispatch({
                type: 'login/logout',
            });
        }
    };

    handleNoticeVisibleChange = visible => {
        if (visible) {
            const { dispatch } = this.props;
            dispatch({
                type: 'global/fetchNotices',
            });
        }
    };

    handScroll = () => {
        const { autoHideHeader } = this.props;
        const { visible } = this.state;
        if (!autoHideHeader) {
            return;
        }
        const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
        if (!this.ticking) {
            this.ticking = true;
            requestAnimationFrame(() => {
                if (this.oldScrollTop > scrollTop) {
                    this.setState({
                        visible: true,
                    });
                }
                if (scrollTop > 300 && visible) {
                    this.setState({
                        visible: false,
                    });
                }
                if (scrollTop < 300 && !visible) {
                    this.setState({
                        visible: true,
                    });
                }
                this.oldScrollTop = scrollTop;
                this.ticking = false;
            });
        }
    };
  
    getMenu=(menuData)=>{
        let result = [];
        for(let data of menuData){
            if(data.children){
                let childrenData = this.getMenu(data.children);
                result.push(<SubMenu title={<span className="submenu-title-wrapper"><Icon type="setting" />{data.value}</span>}>{childrenData}</SubMenu>);
               
            }else{
                result.push(<Menu.Item key={data.key}><Icon type="mail" />{data.value}</Menu.Item>);
            }
        }
        return result;
    };

    menuHandleClick = (e) => { 
       this.setState({
           current: e.key,
        });
        const {dispatch} = this.props; 
        let {topMenuData} = this.state; 
        const treeData = jsonToTreeJson(topMenuData,e.key);
        const childJson = getChiledByMenuIndex(treeData); 
        let param = {key:e.key,url:childJson.url};
        dispatch({type:"testModel/curClickKey",payload:param});  
    }

    render() { 
        let {topMenuData} = this.state; 
        if(!topMenuData){
            return "";
        } 
        let data = [];
        topMenuData.forEach(function(value,index,parData){
            if(value.parentId=="0"){
                data.push({"key":value.id,"value":value.name});
            }
        }); 
        let menuArr = this.getMenu(data); //获取顶部菜单
        return (
            <Menu
                selectedKeys={[this.state.current]}
                mode="horizontal"
                onClick={this.menuHandleClick}>
                {menuArr}
            </Menu>
        );

    };
 
};




export default connect(({ user, global, setting, loading, testModel,}) => ({
    currentUser: user.currentUser,
    collapsed: global.collapsed,
    fetchingNotices: loading.effects['global/fetchNotices'],
    notices: global.notices,
    setting, testModel,
}))(NewHeaderView);