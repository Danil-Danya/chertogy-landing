<template>
    <svg width="24" height="24" viewBox="0 0 512 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M70 160C118 92 180 58 256 58C332 58 394 92 442 160C394 228 332 262 256 262C180 262 118 228 70 160Z"
            stroke="currentColor"
            stroke-width="28"
            stroke-linejoin="round"
        />
        <path
            d="M92 148C154 156 208 160 256 160C304 160 358 156 420 148"
            stroke="currentColor"
            stroke-width="24"
            stroke-linecap="round"
        />
        <defs>
            <clipPath id="master-eye-closed-iris">
                <rect x="178" y="152" width="156" height="88" />
            </clipPath>
        </defs>
        <g clip-path="url(#master-eye-closed-iris)">
            <circle cx="256" cy="174" r="50" stroke="currentColor" stroke-width="24" />
            <circle cx="256" cy="182" r="14" fill="currentColor" />
        </g>
    </svg>
</template>
