import React from 'react';
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/editor';

import propTypes from '../propTypes';

const ALLOWED_BLOCKS = [
  'hurumap-data/flourish-block',
  'hurumap-data/hurumap-block'
];
function Save() {
  return <InnerBlocks.Content />;
}

Save.propTypes = {
  attributes: propTypes.shape({
    title: propTypes.string
  }).isRequired
};

function Edit() {
  return <InnerBlocks allowedBlocks={ALLOWED_BLOCKS} />;
}

Save.propTypes = {
  attributes: propTypes.shape({
    title: propTypes.string
  }).isRequired
};

registerBlockType('hurumap/section-chart', {
  title: __('Section Chart', 'hurumap'),
  icon: 'admin-links', // https://developer.wordpress.org/resource/dashicons/#chart-pie
  category: 'widgets',
  attributes: {
    title: {
      type: 'string'
    }
  },
  edit: Edit,
  save: Save
});
