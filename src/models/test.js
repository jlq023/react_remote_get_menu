/**
 * 测试的model
*/
import { routerRedux } from 'dva/router';
export default {
    namespace: "testModel",
    state: {
        menuData: [
            { "id": "10", "name": "美食", "parentId": "0", "isShow": "1",locale: "menu.ms" },
            { "id": "20", "name": "旅游", "parentId": "0", "isShow": "1",locale: "menu.ly"  },
            { "id": "30", "name": "视频", "parentId": "0", "isShow": "1",locale: "menu.sp"  },

            { "id": "100", "name": "中餐", "parentId": "10", "isShow": "1", href: "/test/zc", path: "/test/zc", locale: "menu.test.zc" },
            { "id": "101", "name": "西餐", "parentId": "10", "isShow": "1", href: "/test/xc", path: "/test/xc", locale: "menu.test.xc" },
            { "id": "200", "name": "风景区", "parentId": "20", "isShow": "1", href: "/test/fj", path: "/test/fj", locale: "menu.test.fj" },
            { "id": "201", "name": "旅游区", "parentId": "20", "isShow": "1", href: "/test/ly", path: "/test/ly", locale: "menu.test.ly" },
            { "id": "300", "name": "优酷", "parentId": "30", "isShow": "1", href: "/test/yk", path: "/test/yk", locale: "menu.test.yk" },
            { "id": "301", "name": "爱奇艺", "parentId": "30", "isShow": "1", href: "/test/aqy", path: "/test/aqy", locale: "menu.test.aqy" },

            { "id": "1001", "name": "川菜", "parentId": "100", "isShow": "1", href: "/test/zc/M1001", path: "/test/zc/M1001", component: "./test/zc/M1001", locale: "menu.test.zc.M1001" },
            { "id": "1002", "name": "粤菜", "parentId": "100", "isShow": "1", href: "/test/zc/M1002", path: "/test/zc/M1002", component: "./test/zc/M1002", locale: "menu.test.zc.M1002" },
            { "id": "1011", "name": "意大利面", "parentId": "101", "isShow": "1", href: "/test/xc/M1003", path: "/test/xc/M1003", component: "./test/xc/M1003", locale: "menu.test.xc.M1003" },
            { "id": "1012", "name": "肯德基", "parentId": "101", "isShow": "1", href: "/test/xc/M1004", path: "/test/xc/M1004", component: "./test/xc/M1004", locale: "menu.test.xc.M1004" },

            { "id": "2001", "name": "安徽黄山", "parentId": "200", "isShow": "1", href: "/test/fj/M1005", path: "/test/fj/M1005", component: "./test/fj/M1005", locale: "menu.test.fj.M1005" },
            { "id": "2002", "name": "九寨沟", "parentId": "200", "isShow": "1", href: "/test/fj/M1006", path: "/test/fj/M1006", component: "./test/fj/M1006" , locale: "menu.test.fj.M1006"},
            { "id": "2011", "name": "洪崖洞", "parentId": "201", "isShow": "1", href: "/test/ly/M1007", path: "/test/ly/M1007", component: "./test/ly/M1007", locale: "menu.test.ly.M1007" },
            { "id": "2012", "name": "洋人街", "parentId": "201", "isShow": "1", href: "/test/ly/M1008", path: "/test/ly/M1008", component: "./test/ly/M1008" , locale: "menu.test.ly.M1008"},

            { "id": "3001", "name": "热映大片", "parentId": "300", "isShow": "1", href: "/test/yk/M1009", path: "/test/yk/M1009", component: "./test/yk/M1009", locale: "menu.test.yk.M1009" },
            { "id": "3002", "name": "最新上映", "parentId": "300", "isShow": "1", href: "/test/yk/M1010", path: "/test/yk/M1010", component: "./test/yk/M1010" , locale: "menu.test.yk.M1010" },
            { "id": "3011", "name": "娱乐节目", "parentId": "301", "isShow": "1", href: "/test/aqy/M1011", path: "/test/aqy/M1011", component: "./test/aqy/M1011", locale: "menu.test.aqy.M1011" },
            { "id": "3012", "name": "动画片", "parentId": "301", "isShow": "1", href: "/test/aqy/M1012", path: "/test/aqy/M1012", component: "./test/aqy/M1012", locale: "menu.test.aqy.M1012"  },
        ],
        curClickKey: 10,//当前被点击的顶部菜单下标
    },
    effects: {
        *getMenuData({ payload, callback }, { call, put }) {
            let data = [
                { "id": "10", "name": "美食", "parentId": "0", "isShow": "1",locale: "menu.ms" },
                { "id": "20", "name": "旅游", "parentId": "0", "isShow": "1",locale: "menu.ly"  },
                { "id": "30", "name": "视频", "parentId": "0", "isShow": "1",locale: "menu.sp"  },

                { "id": "100", "name": "中餐", "parentId": "10", "isShow": "1", href: "/test/zc", path: "/test/zc", locale: "menu.test.zc" },
                { "id": "101", "name": "西餐", "parentId": "10", "isShow": "1", href: "/test/xc", path: "/test/xc", locale: "menu.test.xc" },
                { "id": "200", "name": "风景区", "parentId": "20", "isShow": "1", href: "/test/fj", path: "/test/fj", locale: "menu.test.fj" },
                { "id": "201", "name": "旅游区", "parentId": "20", "isShow": "1", href: "/test/ly", path: "/test/ly", locale: "menu.test.ly" },
                { "id": "300", "name": "优酷", "parentId": "30", "isShow": "1", href: "/test/yk", path: "/test/yk", locale: "menu.test.yk" },
                { "id": "301", "name": "爱奇艺", "parentId": "30", "isShow": "1", href: "/test/aqy", path: "/test/aqy", locale: "menu.test.aqy" },

                { "id": "1001", "name": "川菜", "parentId": "100", "isShow": "1", href: "/test/zc/M1001", path: "/test/zc/M1001", component: "./test/zc/M1001", locale: "menu.test.zc.M1001" },
                { "id": "1002", "name": "粤菜", "parentId": "100", "isShow": "1", href: "/test/zc/M1002", path: "/test/zc/M1002", component: "./test/zc/M1002", locale: "menu.test.zc.M1002" },
                { "id": "1011", "name": "意大利面", "parentId": "101", "isShow": "1", href: "/test/xc/M1003", path: "/test/xc/M1003", component: "./test/xc/M1003", locale: "menu.test.xc.M1003" },
                { "id": "1012", "name": "肯德基", "parentId": "101", "isShow": "1", href: "/test/xc/M1004", path: "/test/xc/M1004", component: "./test/xc/M1004", locale: "menu.test.xc.M1004" },

                { "id": "2001", "name": "安徽黄山", "parentId": "200", "isShow": "1", href: "/test/fj/M1005", path: "/test/fj/M1005", component: "./test/fj/M1005", locale: "menu.test.fj.M1005" },
                { "id": "2002", "name": "九寨沟", "parentId": "200", "isShow": "1", href: "/test/fj/M1006", path: "/test/fj/M1006", component: "./test/fj/M1006" , locale: "menu.test.fj.M1006"},
                { "id": "2011", "name": "洪崖洞", "parentId": "201", "isShow": "1", href: "/test/ly/M1007", path: "/test/ly/M1007", component: "./test/ly/M1007", locale: "menu.test.ly.M1007" },
                { "id": "2012", "name": "洋人街", "parentId": "201", "isShow": "1", href: "/test/ly/M1008", path: "/test/ly/M1008", component: "./test/ly/M1008" , locale: "menu.test.ly.M1008"},

                { "id": "3001", "name": "热映大片", "parentId": "300", "isShow": "1", href: "/test/yk/M1009", path: "/test/yk/M1009", component: "./test/yk/M1009", locale: "menu.test.yk.M1009" },
                { "id": "3002", "name": "最新上映", "parentId": "300", "isShow": "1", href: "/test/yk/M1010", path: "/test/yk/M1010", component: "./test/yk/M1010" , locale: "menu.test.yk.M1010" },
                { "id": "3011", "name": "娱乐节目", "parentId": "301", "isShow": "1", href: "/test/aqy/M1011", path: "/test/aqy/M1011", component: "./test/aqy/M1011", locale: "menu.test.aqy.M1011" },
                { "id": "3012", "name": "动画片", "parentId": "301", "isShow": "1", href: "/test/aqy/M1012", path: "/test/aqy/M1012", component: "./test/aqy/M1012", locale: "menu.test.aqy.M1012"  },
            ];
            
            if (callback) {
                callback(data);
            } else {
                yield put({
                    type: "setMenuData",
                    payload: data
                });
            }

        },
        *curClickKey({payload,callback},{call,put}){
            console.log("Model:",payload);
            let curClickKey = payload.key;
            yield put({
                type:"setCurClickKey",
                payload:curClickKey,
            });
            yield put(routerRedux.replace(payload.url || '/'));
        }
    },
    reducers: {
        setMenuData(state, action) {
            return {
                ...state,
                menuData: action.payload,
            }
        },
        setCurClickKey(state, action) { 
            console.log("Model:",action);
            return {
                ...state,
                curClickKey: action.payload,
            }
        },
    }
}