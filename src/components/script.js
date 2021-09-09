import {useState} from "react";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
const recognition = new SpeechRecognition();

recognition.lang = 'ru-RU';
recognition.continuous = true;
recognition.interimResults = true;
recognition.maxAlternatives = 5;

export const script = () => {
}