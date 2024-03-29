import { forwardRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box } from '@mui/material';

import Alert from './Alert';

type Props = {
  children: JSX.Element | Array<JSX.Element>;
  title?: string;
  className?: string;
};

type Ref = HTMLButtonElement;

const PageContent = forwardRef<Ref, Props>(({
  children,
  title,
  className,
}, ref) => (
  <>
    <Alert />
    <Box ref={ref} className={className}>
      <>
        <Helmet>
          <title>{`${title || 'G-Suite'} ${new Date().getFullYear()}`}</title>
        </Helmet>
        {children}
      </>
    </Box>
  </>
));

PageContent.displayName = 'PageContent';

PageContent.defaultProps = {
  title: 'G-Suite',
  className: '',
};

export default PageContent;
