import React from 'react';
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/editor';
import Edit from './Edit';

import propTypes from '../propTypes';

function slugify(word) {
  if (!word) return '';

  return word
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function Save({ attributes: { description, title } }) {
  return (
    <div id={slugify(title)} data-title={title} data-description={description}>
      <InnerBlocks.Content />
    </div>
  );
}

Save.propTypes = {
  attributes: propTypes.shape({
    title: propTypes.string,
    description: propTypes.string
  }).isRequired
};

registerBlockType('hurumap/section-block', {
  title: __('HURUmap Section', 'hurumap'),
  icon: 'analytics', // https://developer.wordpress.org/resource/dashicons/#chart-pie
  category: 'widgets',
  attributes: {
    title: {
      type: 'string',
      default: ''
    },
    description: {
      type: 'html',
      default: ''
    },
    row: {
      type: 'string',
      default: '0'
    },
    rowsLayout: {
      type: 'array',
      default: []
    }
  },
  edit: Edit,
  save: Save
});
