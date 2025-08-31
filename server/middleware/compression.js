import compression from 'compression';

export default defineEventHandler((event) => {
    const req = event.node.req;
    const res = event.node.res;

    return new Promise((resolve) => {
        compression({
        threshold: 0, 
        })(req, res, () => resolve());
    });
});
