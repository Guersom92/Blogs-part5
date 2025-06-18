const { test, expect, beforeEach, describe } = require('@playwright/test')
const helper = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:5173/api/testing/reset')
    const user = { username: "guersom80", name: "Guersom", password: "123456" }
    const user2 = { username: "guersom90", name: "Guersom2", password: "654321" }
    await request.post('http://localhost:5173/api/users',
      { data: user })
    await request.post('http://localhost:5173/api/users',
      { data: user2 })
    await page.goto('http://localhost:5173')

  })

  test('Login form is shown', async ({ page }) => {
    const username = await page.getByTestId('username')
    const password = await page.getByTestId('password')
    await expect(username).toBeVisible()
    await expect(password).toBeVisible()

  })
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await helper.loginWith(page, "guersom80", "123456")
      await expect(page.getByText('Guersom logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill("guersom80")
      await page.getByTestId('password').fill("12345")
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('invalid username or password')).toBeVisible()
      await expect(page.getByText('Guersom logged in')).not.toBeVisible()

    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await helper.loginWith(page, "guersom80", "123456")
    })

    test('a new blog can be created', async ({ page }) => {
      await helper.createBlog(page, "My experience attending at CSS Day 2024", "Kevin Powell", "www.kevinpowell.co/article/my-experience-attending-css-day-2024/")
      await expect(page.getByText('My experience attending at CSS Day 2024 Kevin Powell')).toBeVisible()
    })
  })

  describe('and a blog exists', () => {
    beforeEach(async ({ page }) => {
      await helper.loginWith(page, "guersom80", "123456")
      await helper.createBlog(page, "My experience attending at CSS Day 2024", "Kevin Powell", "www.kevinpowell.co/article/my-experience-attending-css-day-2024/")
    })

    test('the blog can be edited', async ({ page }) => {
      const blogText = await page.getByText('My experience attending at CSS Day 2024 Kevin Powell')
      const fatherElement = await blogText.locator("..")
      await fatherElement.getByText("show").click()
      await fatherElement.getByText("like").click()
      await expect(fatherElement.getByText("likes 1")).toBeVisible()
    })

    test('the blog can be deleted', async ({ page }) => {
      const blogText = await page.getByText('My experience attending at CSS Day 2024 Kevin Powell')
      const fatherElement = await blogText.locator("..")
      await fatherElement.getByText("show").click()
      page.on('dialog', dialog => dialog.accept())//Diciendo qué hacer cuando salga la ventana del window.confirm
      await fatherElement.getByText("remove").click()
      await expect(fatherElement.getByText("My experience attending at CSS Day 2024 Kevin Powell")).not.toBeVisible()
    })

    test("only creator can remove the blog", async ({ page }) => {
      const blogText = await page.getByText('My experience attending at CSS Day 2024 Kevin Powell')
      const fatherElement = await blogText.locator("..")
      await fatherElement.getByText("show").click()
      await expect(fatherElement.getByText("remove")).toBeVisible()
      //Cambiando de Usuario
      await page.getByText("logout").click()
      await helper.loginWith(page, "guersom90", "654321")
      await fatherElement.getByText("show").click()
      await expect(fatherElement.getByText("remove")).not.toBeVisible()
    })

  })

  describe("multiple blogs exist", () => {
    beforeEach(async ({ page, request }) => {

      const loginResponse = await request.post('http://localhost:5173/api/login', {
        data: {
          username: "guersom80",
          password: "123456"
        }
      })
      const token = (await loginResponse.json()).token

      await request.post('http://localhost:5173/api/blogs', {
        data: helper.blogs[0],
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      await request.post('http://localhost:5173/api/blogs', {
        data: helper.blogs[1],
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      await request.post('http://localhost:5173/api/blogs', {
        data: helper.blogs[2],
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      await page.goto('http://localhost:5173')
    })


    test('blogs are show in order', async ({ page }) => {
      await helper.loginWith(page, "guersom80", "123456")
      //Obteniendo los blogs en el orden que aparecen
      const firstBlog = await page.locator('.blog').nth(0)
      const secondBlog = await page.locator('.blog').nth(1)
      const thirdBlog = await page.locator('.blog').nth(2)
      await firstBlog.getByText('show').click()
      await secondBlog.getByText('show').click()
      await thirdBlog.getByText('show').click()
      //Extrayendo el número de likes
      const firstBlogLikes = await firstBlog.locator('span').textContent()
      const secondBlogLikes = await secondBlog.locator('span').textContent()
      const thirdBlogLikes = await thirdBlog.locator('span').textContent()
      //Verificando que se encuentren de mayor a menor
      await expect(firstBlogLikes).toBe("100")
      await expect(secondBlogLikes).toBe("30")
      await expect(thirdBlogLikes).toBe("5")
    })
  })


})