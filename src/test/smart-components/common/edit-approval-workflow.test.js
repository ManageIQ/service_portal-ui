import React from 'react';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store' ;
import { Modal } from '@patternfly/react-core';
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';
import { APPROVAL_API_BASE } from '../../../utilities/constants';
import FormRenderer from '../../../smart-components/common/form-renderer';
import EditApprovalWorkflow from '../../../smart-components/common/edit-approval-workflow';
import { rawComponents } from '@data-driven-forms/pf4-component-mapper/dist/index';

describe('<EditApprovalWorkflow />', () => {
  let initialProps;
  let initialState;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;

  const ComponentWrapper = ({ store, children, initialEntries }) => (
    <Provider store={ store }>
      <MemoryRouter initialEntries={ initialEntries }>
        { children }
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      closeUrl: 'foo',
      objectType: 'Portfolio'
    };
    initialState = {
      approvalReducer: {
        workflows: [{
          label: 'foo',
          value: 'bar'
        }]
      }
    };
    mockStore = configureStore(middlewares);
  });

  it('should render correctly', () => {
    const store = mockStore({});
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows`, mockOnce({ body: { data: []}}));
    const wrapper = shallow(<ComponentWrapper store={ store }><EditApprovalWorkflow { ...initialProps } /></ComponentWrapper>).dive();

    setImmediate(() => {
      expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
  });

  it('should create the edit workflow modal', async (done) => {
    const store = mockStore(initialState);

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows`, mockOnce({
      body: {
        data: [{
          name: 'workflow',
          id: '123'
        }]
      }
    }));
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/?app_name=catalog&object_type=Portfolio&object_id=123&limit=50&offset=0`,
      mockOnce({ body: {
        data: [{
          name: 'workflow',
          id: '123'
        }]
      }
      }));

    const expectedSchema = {
      fields: [{
        component: componentTypes.SELECT,
        name: 'workflow',
        label: 'Approval workflow',
        loadOptions: expect.any(Function),
        isSearchable: true,
        isClearable: true
      }]
    };

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store } initialEntries={ [ '/portfolios', '/portfolios/123' ]}>
          <Route path="portfolios/:id" render={ () => <EditApprovalWorkflow { ...initialProps }/> }/>
        </ComponentWrapper>
      );
    });

    setImmediate(async () => {
      wrapper.update();
      const select = wrapper.find(rawComponents.Select);
      const modal = wrapper.find(Modal);
      const form = wrapper.find(FormRenderer);
      expect(modal.props().title).toEqual('Set approval workflow');
      expect(form.props().schema).toEqual(expectedSchema);
      setImmediate(() => {
        done();
      });
    });
  });
});
