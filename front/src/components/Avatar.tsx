export type AvatarProps = {
  url: string | undefined;
  domain: string;
};

export default function Avatar({ url, domain }: AvatarProps) {
  if (url) {
    return <img src={url} alt="Avatar record of the domain" className="avatar" />;
  } else {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none" className="avatar">
        {' '}
        <path fill="url(#B)" d="M0 0h270v270H0z" />
        <defs>
          <filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270">
            <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%" />
          </filter>
        </defs>
        <path
          d="M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z"
          fill="#FFF"
        />
        <defs>
          <linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse">
            <stop stop-color="#b033d6" />
            <stop offset="1" stop-color="#e0961d" stop-opacity=".99" />
          </linearGradient>
        </defs>
        <text
          x="32.5"
          y="231"
          font-size="27"
          fill="#fff"
          filter="url(#A)"
          font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif"
          font-weight="bold"
        >
          {domain}
        </text>
      </svg>
    );
  }
}
