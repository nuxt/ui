import type { Component } from 'vue'

interface Slideover {
    ui?: any;
    side?: 'right' | 'left';
    transition?: boolean;
    appear?: boolean;
    overlay?: boolean;
    preventClose?: boolean;
    modelValue?: boolean;
}

interface SlideoverState {
    component: Component | string;
    props: Slideover;
}

