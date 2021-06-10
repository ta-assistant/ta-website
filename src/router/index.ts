import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import SignIn from "../views/SignIn.vue";
import course from "../views/course.vue";
import CourseDetail from "../views/course/detail.vue";
import WorkDetail from "../views/course/work.vue";
import WorkSubmission from "../views/course/submission.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/signIn",
    name: "SignIn",
    component: SignIn,
  },
  {
    path: "/course",
    name: "course",
    component: course,
  },
  {
    path: "/course/:id",
    name: "course_detail",
    component: CourseDetail,
  },
  {
    path: "/work/:id",
    name: "WorkSubmission",
    component: WorkSubmission,
  },
  {
    path: "/work/:id/:studentId",
    name: "exercise",
    component: WorkDetail,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
