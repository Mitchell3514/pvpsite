/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './GoogleAd.css';

function GoogleAd() {
  return (
    <div
      className={s.root}
      style={{ border: 'red', backgroundColor: 'blue' }}
      /* dangerouslySetInnerHTML={{
        __html: '<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>' +
        '<!-- bot pvpcraft sidebar -->' +
        '<ins class="adsbygoogle"' +
        'style="display:inline-block;width:300px;height:600px"' +
        'data-ad-client="ca-pub-4388725279944066"' +
        'data-ad-slot="2402323414"></ins>' +
        '<script>' +
        '(adsbygoogle = window.adsbygoogle || []).push({})' +
        '</script>' }} */
      dangerouslySetInnerHTML={{
        __html: '<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>' +
        '<!-- responsive pvpcraft sidebar -->' +
        '<ins class="adsbygoogle" ' +
        'style="display:block" ' +
        'data-ad-client="ca-pub-4388725279944066" ' +
        'data-ad-slot="3922755812" ' +
        'data-ad-format="auto"></ins>' +
        '<script>' +
        '(adsbygoogle = window.adsbygoogle || []).push({});' +
        '</script>',
      }}
    />);
}

export default withStyles(s)(GoogleAd);
