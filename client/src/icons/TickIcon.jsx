import * as React from "react";

const TickIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={18}
        viewBox="0 0 512 512"
        fill="currentColor" // Ensure this matches your design
        {...props}
    >
        <path
            d="M173.898 439.404l-166.4-166.4c-12.496-12.496-12.496-32.758 0-45.254l45.254-45.254c12.496-12.496 32.758-12.496 45.254 0L192 312.69l278.593-278.593c12.497-12.496 32.759-12.496 45.255 0l45.254 45.254c12.497 12.496 12.497 32.758 0 45.254l-324.8 324.8c-12.497 12.496-32.759 12.496-45.254 0z"
        />
    </svg>
);

export default TickIcon;
