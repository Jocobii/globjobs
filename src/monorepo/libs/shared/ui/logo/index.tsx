import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

type Props = {
  sx?: object;
  isWhite?: boolean;
};

function Logo({ sx = {}, isWhite = false }: Props): JSX.Element {
  const theme = useTheme();

  let fillColor = theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.main;

  if (isWhite) fillColor = '#fff';

  return (
    <Box sx={{ width: 40, height: 40, ...sx }}>
      <svg width="100%" height="100%" viewBox="0 0 70 70">
        <g id="G-Global" transform="matrix(1,0,0,1,8.00306,0.455)">
          <g transform="matrix(1,0,0,1,-314.16,-320.78)">
            <path
              d="M342.41,352.89L326.41,336.89C325.069,335.556 322.871,335.556 321.53,336.89L320.25,338.17C318.916,339.511 318.916,341.709 320.25,343.05L330.07,352.87C331.404,354.211 331.404,356.409 330.07,357.75L320.25,367.58C318.916,368.921 318.916,371.119 320.25,372.46L321.53,373.74C322.873,375.068 325.067,375.068 326.41,373.74L342.41,357.74C343.724,356.402 343.724,354.228 342.41,352.89Z"
              fillRule="nonzero"
              fill={fillColor}
            />
          </g>
          <g transform="matrix(0.692773,-0.721156,0.721156,0.692773,-472.39,18.42)">
            <circle cx="319.02" cy="355.33" r="4.87" fill={fillColor} />
          </g>
          <g transform="matrix(1,0,0,1,-314.16,-320.78)">
            <path
              d="M348.72,351.47L367.14,333C368.468,331.657 368.468,329.463 367.14,328.12L365.86,326.84C364.519,325.506 362.321,325.506 360.98,326.84L348.71,339.1L336.44,326.84C335.099,325.506 332.901,325.506 331.56,326.84L330.28,328.12C328.952,329.463 328.952,331.657 330.28,333L348.72,351.47Z"
              fill={fillColor}
              fillRule="nonzero"
            />
          </g>
          <g transform="matrix(1,0,0,1,-314.16,-320.78)">
            <path
              d="M348.72,359.19L330.3,377.61C328.972,378.953 328.972,381.147 330.3,382.49L331.58,383.77C332.923,385.098 335.117,385.098 336.46,383.77L348.73,371.5L361,383.77C362.341,385.104 364.539,385.104 365.88,383.77L367.16,382.49C368.488,381.147 368.488,378.953 367.16,377.61L348.72,359.19Z"
              fill={fillColor}
              fillRule="nonzero"
            />
          </g>
          <g transform="matrix(1,0,0,1,-314.16,-320.78)">
            <path
              d="M348.72,330.49C351.383,330.485 353.571,328.293 353.571,325.63C353.571,322.964 351.378,320.77 348.711,320.77C346.045,320.77 343.851,322.964 343.851,325.63C343.851,326.955 344.393,328.224 345.35,329.14C346.255,330.011 347.464,330.495 348.72,330.49Z"
              fill={fillColor}
              fillRule="nonzero"
            />
          </g>
          <g transform="matrix(1,0,0,1,-314.16,-320.78)">
            <path
              d="M348.72,380.16C346.057,380.165 343.869,382.357 343.869,385.02C343.869,387.686 346.062,389.88 348.729,389.88C351.395,389.88 353.589,387.686 353.589,385.02C353.589,383.695 353.047,382.426 352.09,381.51C351.184,380.641 349.975,380.157 348.72,380.16Z"
              fill={fillColor}
              fillRule="nonzero"
            />
          </g>
        </g>
      </svg>
    </Box>
  );
}

export default Logo;