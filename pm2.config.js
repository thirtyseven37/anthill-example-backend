module.exports = {
    apps: [{
        name: 'anthill_usage_example',
        script: './index.ts',
        interpreter: './node_modules/.bin/ts-node',
        args: ['--inspect'],
        watch: true,
        ignore_watch: ['node_modules'],
        exec_mode: "cluster",
        instances: 1,
    }]
};
