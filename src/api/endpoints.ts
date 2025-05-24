// const FACULTY_BASE = '/faculty';
// const STUDENT_BASE = '/student';
// const EXAM_BASE = '/exam';
// const COURSE_BASE = '/course';
// const MATERIAL_BASE = '/material';
// const TEST_BASE = '/test';

// export const endpoints = {
//     faculty: {
//         list: FACULTY_BASE,
//         detail: (id: string) => `${FACULTY_BASE}/${id}`,
//         create: FACULTY_BASE,
//         update: (id: string) => `${FACULTY_BASE}/${id}`,
//         delete: (id: string) => `${FACULTY_BASE}/${id}`,
//     },
//     student: {
//         list: STUDENT_BASE,
//         detail: (id: string) => `${STUDENT_BASE}/${id}`,
//         create: STUDENT_BASE,
//         update: (id: string) => `${STUDENT_BASE}/${id}`,
//         delete: (id: string) => `${STUDENT_BASE}/${id}`,
//     },
//     exam: {
//         list: EXAM_BASE,
//         detail: (id: string) => `${EXAM_BASE}/${id}`,
//         create: EXAM_BASE,
//         update: (id: string) => `${EXAM_BASE}/${id}`,
//         delete: (id: string) => `${EXAM_BASE}/${id}`,
//     },
//     course: {
//         list: COURSE_BASE,
//         detail: (id: string) => `${COURSE_BASE}/${id}`,
//         create: COURSE_BASE,
//         update: (id: string) => `${COURSE_BASE}/${id}`,
//         delete: (id: string) => `${COURSE_BASE}/${id}`,
//     },
//     material: {
//         list: MATERIAL_BASE,
//         detail: (id: string) => `${MATERIAL_BASE}/${id}`,
//         create: MATERIAL_BASE,
//         update: (id: string) => `${MATERIAL_BASE}/${id}`,
//         delete: (id: string) => `${MATERIAL_BASE}/${id}`,
//     },
//     test: {
//         list: TEST_BASE,
//         detail: (id: string) => `${TEST_BASE}/${id}`,
//         create: TEST_BASE,
//         update: (id: string) => `${TEST_BASE}/${id}`,
//         delete: (id: string) => `${TEST_BASE}/${id}`,
//     },
// };

const createCrudEndpoints = (base: string) => ({
    list: base,
    detail: (id: string) => `${base}/${id}`,
    create: base,
    update: (id: string) => `${base}/${id}`,
    delete: (id: string) => `${base}/${id}`,
});

export const endpoints = {
    faculty: createCrudEndpoints('/faculty'),
    student: createCrudEndpoints('/student'),
    exam: createCrudEndpoints('/exam'),
    course: createCrudEndpoints('/course'),
    material: createCrudEndpoints('/material'),
    test: createCrudEndpoints('/test'),
};
