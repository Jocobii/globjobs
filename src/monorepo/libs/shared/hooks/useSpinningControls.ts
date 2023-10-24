import { useState } from 'react';

export default function useSpinningControls() {
  const [hoveredRowId, setHoveredRowId] = useState<null | string>(null);

  const onMouseEnterRow = (event: React.MouseEvent<HTMLInputElement>) => {
    const id = event.currentTarget.getAttribute('data-id');
    setHoveredRowId(id);
  };

  const onMouseLeaveRow = () => {
    setHoveredRowId(null);
  };

  return {
    hoveredRowId,
    onMouseEnterRow,
    onMouseLeaveRow,
  };
}
