import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import {
    List,
    Card,
    Row,
    Col,
    Radio,
    Input,
    Progress,
    Button,
    Icon,
    Dropdown,
    Menu,
    Avatar,
    Modal,
    Form,
    DatePicker,
    Select,
} from 'antd';

@connect(({ list, loading }) => ({
    list,
    loading: loading.models.list,
}))
export default class MenuTest extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            type: 0
        };
    }

    render() {
        return (
            <div>
                <FormattedMessage id="test.label" />:{this.state.type}
                <br/> 
                <a href="">
                    <FormattedMessage id="test.label" />
                </a>
            </div>
        );
    };

};
