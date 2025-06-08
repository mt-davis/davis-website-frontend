"use client";

import { useState, useEffect } from 'react';

const textArray = ["Transformational", "Changing", " A journey", "LIFE!"];
const typingDelay = 200;
const erasingDelay = 100;
const newTextDelay = 2000;

export default function TypedText() {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleTyping = () => {
      const currentWord = textArray[currentIndex];
      
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentWord.length) {
          timeout = setTimeout(() => {
            setCurrentText(currentWord.slice(0, currentText.length + 1));
          }, typingDelay);
        } 
        // Word is complete, wait then start deleting
        else {
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, newTextDelay);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          timeout = setTimeout(() => {
            setCurrentText(currentWord.slice(0, currentText.length - 1));
          }, erasingDelay);
        } 
        // Word is fully deleted, move to next word
        else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % textArray.length);
        }
      }
    };

    handleTyping();

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting]);

  return (
    <div className="inline-flex items-center font-montserrat">
      <span className="typed-text text-pink-500">{currentText}</span>
      <span className={`cursor h-12 ${currentText.length < textArray[currentIndex].length && !isDeleting ? 'typing' : ''}`}></span>
    </div>
  );
} 