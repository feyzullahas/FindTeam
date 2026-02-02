import React from 'react';
import { motion } from 'framer-motion';

/**
 * Modern, reusable Card component with variants and hover effects
 * 
 * @param {string} variant - Card style variant: 'default', 'elevated', 'outlined', 'hover'
 * @param {string} padding - Padding size: 'sm', 'md', 'lg'
 * @param {React.ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 * @param {boolean} animated - Enable entrance animation
 */
const Card = ({
    variant = 'default',
    padding = 'md',
    children,
    className = '',
    animated = false,
    ...props
}) => {
    const variantClasses = {
        default: 'card',
        elevated: 'card-elevated',
        outlined: 'card-outlined',
        hover: 'card-hover',
    };

    const paddingClasses = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    const classes = `
    ${variantClasses[variant] || variantClasses.default} 
    ${variant !== 'elevated' ? paddingClasses[padding] : ''} 
    ${className}
  `.trim().replace(/\s+/g, ' ');

    if (animated) {
        return (
            <motion.div
                className={classes}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                {...props}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
};

export default Card;
