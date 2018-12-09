/**
 * 重写布局组件
 * 
*/
import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import { formatMessage } from 'umi/locale';
import SiderMenu from '@/components/SiderMenu';
import Authorized from '@/utils/Authorized';
import SettingDrawer from '@/components/SettingDrawer';
import logo from '../assets/logo.svg';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import Exception403 from '../pages/Exception/403';
import NewHeaderView from './NewHeaderView' 
import { jsonToTreeJson,findMenuByUrl,getParentId, } from "../utils/treeutil";


const { Content } = Layout;
const SubMenu = Menu.SubMenu;


// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
    return data
        .map(item => {
            if (!item.name || !item.path) {
                return null;
            }

            let locale = 'menu';
            if (parentName) {
                locale = `${parentName}.${item.name}`;
            } else {
                locale = `menu.${item.name}`;
            }

            const result = {
                ...item,
                name: formatMessage({ id: locale, defaultMessage: item.name }),
                locale,
                authority: item.authority || parentAuthority,
            };
            if (item.routes) {
                const children = formatter(item.routes, item.authority, locale);
                // Reduce memory usage
                result.children = children;
            }
            delete result.routes;
            return result;
        })
        .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

const query = {
    'screen-xs': {
        maxWidth: 575,
    },
    'screen-sm': {
        minWidth: 576,
        maxWidth: 767,
    },
    'screen-md': {
        minWidth: 768,
        maxWidth: 991,
    },
    'screen-lg': {
        minWidth: 992,
        maxWidth: 1199,
    },
    'screen-xl': {
        minWidth: 1200,
        maxWidth: 1599,
    },
    'screen-xxl': {
        minWidth: 1600,
    },
};

class NewLayout extends React.PureComponent {
    TAG="NewLayout:";
    constructor(props) {
        super(props);
        this.getPageTitle = memoizeOne(this.getPageTitle);
        this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, isEqual);
        this.breadcrumbNameMap = this.getBreadcrumbNameMap();
        this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
    }

    state = {
        rendering: true,
        isMobile: false,
        menuData: this.getMenuData(),
    };


    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'user/fetchCurrent',
        });
        dispatch({
            type: 'setting/getSetting',
        });
        this.renderRef = requestAnimationFrame(() => {
            this.setState({
                rendering: false,
            });
        });
        this.enquireHandler = enquireScreen(mobile => {
            const { isMobile } = this.state;
            if (isMobile !== mobile) {
                this.setState({
                    isMobile: mobile,
                });
            }
        });
    }

    componentDidUpdate(preProps) {
        // After changing to phone mode,
        // if collapsed is true, you need to click twice to display
        this.breadcrumbNameMap = this.getBreadcrumbNameMap();
        const { isMobile } = this.state;
        const { collapsed } = this.props;
        if (isMobile && !preProps.isMobile && !collapsed) {
            this.handleMenuCollapse(false);
        }
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.renderRef);
        unenquireScreen(this.enquireHandler);
    }

    getContext() {
        const { location } = this.props;
        return {
            location,
            breadcrumbNameMap: this.breadcrumbNameMap,
        };
    } 

    getMenuData() {
        let {
            route: { routes, authority },
            location:{pathname},
            testModel:{curClickKey,menuData},
        } = this.props; 
        if(!curClickKey){
            const superMenuRoot = getParentId(menuData, pathname); 
            if(superMenuRoot&&superMenuRoot.id){
                curClickKey = superMenuRoot.id;
            }
        } 
        const treeData = jsonToTreeJson(menuData,curClickKey);//通过顶部菜单的下标，得到该下标所属的菜单数据
        treeData.forEach(function(value,index,data){
            delete treeData[index].routes;
        });
       return memoizeOneFormatter(treeData, authority);
    }


    /**
     * 获取面包屑映射
     * @param {Object} menuData 菜单配置
     */
    getBreadcrumbNameMap() {
        const routerMap = {};
        const mergeMenuAndRouter = data => {
            data.forEach(menuItem => {
                if (menuItem.children) {
                    mergeMenuAndRouter(menuItem.children);
                }
                // Reduce memory usage
                routerMap[menuItem.path] = menuItem;
            });
        };
        mergeMenuAndRouter(this.getMenuData());
        return routerMap;
    }

    matchParamsPath = pathname => {
        const pathKey = Object.keys(this.breadcrumbNameMap).find(key =>{ 
            pathToRegexp(key).test(pathname)
        });
        return this.breadcrumbNameMap[pathKey];
    };

    getPageTitle = pathname => {
        const currRouterData = this.matchParamsPath(pathname);

        if (!currRouterData) {
            return 'Ant Design Pro';
        }
        const message = formatMessage({
            id: currRouterData.locale || currRouterData.name,
            defaultMessage: currRouterData.name,
        });
        return `${message} - Ant Design Pro`;
    };

    getLayoutStyle = () => {
        const { isMobile } = this.state;
        const { fixSiderbar, collapsed, layout } = this.props;
        if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
            return {
                paddingLeft: collapsed ? '80px' : '256px',
            };
        }
        return null;
    };

    getContentStyle = () => {
        const { fixedHeader } = this.props;
        return {
            margin: '24px 24px 0',
            paddingTop: fixedHeader ? 64 : 0,
        };
    };

    handleMenuCollapse = collapsed => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/changeLayoutCollapsed',
            payload: collapsed,
        });
    };

    renderSettingDrawer() {
        // Do not render SettingDrawer in production
        // unless it is deployed in preview.pro.ant.design as demo
        const { rendering } = this.state;
        if ((rendering || process.env.NODE_ENV === 'production') && APP_TYPE !== 'site') {
          return null;
        }
        return <SettingDrawer />;
      }
      
      handleOpenChange = () =>{

      };

    render() {
        const {
            navTheme,
            layout: PropsLayout,
            children,
            location: { pathname },
            testModel:{curClickKey},
        } = this.props; 
        const { isMobile } = this.state; 
        const menuData = this.getMenuData(); 
        const allMenuData = this.props.testModel.menuData;
        const isTop = PropsLayout === 'topmenu'; 
        const routerConfig = this.matchParamsPath(pathname); 
        console.log(this.TAG,"this.props menuData:",this.props); 
        const layout = (
            <Layout>
                {isTop && !isMobile  ? null : (
                    <SiderMenu
                        logo={logo}
                        Authorized={Authorized}
                        theme={navTheme}
                        onCollapse={this.handleMenuCollapse}
                        menuData={menuData}
                        isMobile={isMobile} 
                        {...this.props}
                    />
                )}
                <Layout
                    style={{
                        ...this.getLayoutStyle(),
                        minHeight: '100vh',
                    }}
                > 
                    <div style={{height:"100px",background:"#fff"}}>
                         <NewHeaderView {...this.props} />
                    </div>
 
                    <Content style={this.getContentStyle()}>
                        <Authorized
                            authority={routerConfig && routerConfig.authority}
                            noMatch={<Exception403 />}
                        >
                            {children}
                        </Authorized>
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        ); 
        return (
            <React.Fragment>
              <DocumentTitle title={this.getPageTitle(pathname)}>
                <ContainerQuery query={query}>
                  {params => (
                    <Context.Provider value={this.getContext()}>
                      <div className={classNames(params)}>{layout}</div>
                    </Context.Provider>
                  )}
                </ContainerQuery>
              </DocumentTitle>
              {this.renderSettingDrawer()}
            </React.Fragment>
          );
    };
}

export default connect(({ global, setting,testModel }) => ({
    collapsed: global.collapsed,
    layout: setting.layout,
    ...setting,
    testModel,
}))(NewLayout);

