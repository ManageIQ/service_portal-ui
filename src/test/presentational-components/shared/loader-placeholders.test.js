import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import configureStore from 'redux-mock-store';
import {
  AppPlaceholder,
  CardLoader,
  ListLoader
} from '../../../presentational-components/shared/loader-placeholders';

describe('Loader placeholders', () => {
  it('should render <AppPlaceholder /> correctly', () => {
    const mockStore = configureStore([]);
    expect(
      toJson(shallow(<AppPlaceholder store={mockStore} />))
    ).toMatchSnapshot();
  });

  it('should render <CardLoader /> correctly', () => {
    expect(toJson(shallow(<CardLoader />))).toMatchSnapshot();
  });

  it('should render <ListLoader /> correctly', () => {
    expect(toJson(shallow(<ListLoader />))).toMatchSnapshot();
  });
});
