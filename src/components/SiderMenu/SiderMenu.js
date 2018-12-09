import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import pathToRegexp from 'path-to-regexp';
import classNames from 'classnames';
import Link from 'umi/link';
import styles from './index.less';
import BaseMenu, { getMenuMatches } from './BaseMenu';
import { urlToList } from '../_utils/pathTools';
import {findMenuByUrl} from '../../utils/treeutil.js';
const { Sider } = Layout;


/**
 * 获得菜单子节点
 * @memberof SiderMenu
 */
const getDefaultCollapsedSubMenus = props => {
  const {
    location: { pathname },
    flatMenuKeys,
  } = props;
  return urlToList(pathname)
    .map(item => getMenuMatches(flatMenuKeys, item)[0])
    .filter(item => item);
};

/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => {path,path2}
 * @param  menu
 */
export const getFlatMenuKeys = menu =>
  menu.reduce((keys, item) => {
     
    keys.push(item.path);
    if (item.children) {
      return keys.concat(getFlatMenuKeys(item.children));
    }
    return keys;
  }, []);

/**
 * Find all matched menu keys based on paths
 * @param  flatMenuKeys: [/abc, /abc/:id, /abc/:id/info]
 * @param  paths: [/abc, /abc/11, /abc/11/info]
 */
export const getMenuMatchKeys = (flatMenuKeys, paths) =>
  paths.reduce(
    (matchKeys, path) =>
      matchKeys.concat(flatMenuKeys.filter(item => pathToRegexp(item).test(path))),
    []
  );

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    // this.flatMenuKeys = getFlatMenuKeys(props.menuData);//BasicLayout布局使用 
    this.flatMenuKeys =  getFlatMenuKeys(props.testModel.menuData);//NewLayout布局使用
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(props),
    };
    //console.log("SiderMenu  constructor openKeys :",this.flatMenuKeys);
  }

  static getDerivedStateFromProps(props, state) {
    let { pathname } = state; 
    console.log("SiderMenu getDerivedStateFromProps openKeys :",state.openKeys);
   
   if (props.location.pathname !== pathname) {
      return {
        pathname: props.location.pathname,
        openKeys: getDefaultCollapsedSubMenus(props),
      };
    }
    return null;
  }

  isMainMenu = key => {
    const { menuData } = this.props;
    return menuData.some(item => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };

  handleOpenChange = openKeys => {
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
    });
  };

  getOpenKey = (menuData,pathname) =>{
    //["/test023","/test/aqy","/test/aqy/M1012"]
    const result = findMenuByUrl(menuData,pathname);
   // const result = this.getParentData(menuData,obj);
    // console.log("SiderMenu getOpenKey obj:",obj);
    console.log("SiderMenu getOpenKey result:",result);
    if(!result){
      return [];
    }
    return [result.parent.path,result.path];
  };

  getParentData = (menuData,curData) => {
    let result = [];
    for(let value of menuData.parent){
      result[0] = value;
      if(value.children){
        return result;
      }
      if(curData.path==value.path){
        return result;
      }
        result.push(this.getParentData(value.children,curData));
    }  
    //console.log("SiderMenu getParentData:",result);
    return result;
  };

  render() {
    const { logo, collapsed, onCollapse, fixSiderbar, theme,menuData,location:{pathname} } = this.props;
    let { openKeys } = this.state;
    if(!openKeys||openKeys.length==0){
      openKeys = this.getOpenKey(this.props.testModel.menuData,pathname);
    }
    const defaultProps = collapsed ? {} : { openKeys }; 
    console.log("SiderMenu openKeys:", openKeys); 
    const siderClassName = classNames(styles.sider, {
      [styles.fixSiderbar]: fixSiderbar,
      [styles.light]: theme === 'light',
    });

    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={onCollapse}
        width={256}
        theme={theme}
        className={siderClassName}
      >
        <div className={styles.logo} id="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
            <h1>Ant Design Pro</h1>
          </Link>
        </div>
        <BaseMenu
          {...this.props}
          mode="inline"
          handleOpenChange={this.handleOpenChange}
          onOpenChange={this.handleOpenChange}
          style={{ padding: '16px 0', width: '100%' }}
          {...defaultProps}
        />
      </Sider>
    );
  }
}
