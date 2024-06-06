import {useRouter} from "vue-router";

const router=useRouter()
function goTo(route) {
    router.push(route)
}

export {
    goTo,
}