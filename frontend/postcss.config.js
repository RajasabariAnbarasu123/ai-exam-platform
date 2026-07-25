module.exports = {
    plugins: {
        tailwindcss: {},
        autoprefixer: {
            flexbox: 'no-2009'
        },
        'postcss-preset-env': {
            stage: 3,
            features: {
                'nesting-rules': true,
                'custom-media-queries': true,
                'custom-properties': true
            }
        },
        'postcss-flexbugs-fixes': {},
        'postcss-normalize': {
            allowDuplicates: false
        }
    }
};