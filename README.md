## Documentation Test-Cases
**enpoint: `/api/signup`**
- Method: POST
- request body: 
```json
{
  "name": "string",
  "password": "string",
  "role": "string"
}
```
- response body: 
```json
{
  "status": "ok",
	"data": {
		"id": 3,
		"name": "string",
		"password": "string",
		"role": "string",
		"updatedAt": "string",
		"createdAt": "string"
	}
}
```

**enpoint: `/api/signin`**
- Method: POST
- Rate Limit: 15 minutes if your password is incorrect
- request body: 
```json
{
  "name": "string",
  "password": "string"
}
```
- response body: 
```json
{
  "status": "ok",
	"data": {
		"token": "string"
	}
}
```
**enpoint: `/api/users/:id`**
- Method: GET
- response body: 
```json
{
 "status": "ok",
	"data": {
		"id": 1,
		"name": "string",
		"role": "string"
	}
}
```
**enpoint: `/api/users/update/:id`**
- Method: PUT
- request body: 
```json
{
  "name": "string",
  "password": "string",
  "role": "string"
}
```
- response body: 
```json
{
 	"status": "ok",
	"data": {
		"id": "int",
		"name": "string",
		"password": "string",
		"role": "string",
		"createdAt": "string",
		"updatedAt": "string"
	}
}
```
**enpoint: `/api/products`**
- Method: POST
- Authorization : Bearer <JWT_TOKEN> (only for vendor)
- request body:
```json
{
  "name": "string",
  "price": "number",
  "description": "string",
  "stock": "number"
}
```
- response body: 
```json
{
  	"status": "ok",
	"data": {
		"id": "integer",
		"userId": "integer",
		"name": "string",
		"price": "number",
		"description": "string",
		"stock": "number",
		"updatedAt": "string",
		"createdAt": "string"
	}
}
```
**enpoint: `/api/products/:id`**
- Method: GET
- Authorization: Bearer <JWT_TOKEN> (only for vendor)
- response body:
```json
{
  "status": "ok",
    "data": {
        "id": "integer",
        "userId": "integer",
        "name": "string",
        "price": "number",
        "description": "string",
        "stock": "number",
        "updatedAt": "string",
        "createdAt": "string"
    }
}
```

**enpoint: `/api/products/update/:id`**
- Method: PUT
- Authorization: Bearer <JWT_TOKEN> (only for vendor)
- request body:
```json
{
  "name": "string",
  "price": "number",
  "description": "string",
  "stock": "number"
}
```
- response body:
```json
{
  "status": "ok",
  "data": {
    "id": "integer",
    "userId": "integer",
    "name": "string",
    "price": "number",
    "description": "string",
    "stock": "number",
    "updatedAt": "string",
    "createdAt": "string"
  }
}
```

**enpoint: `/api/products/delete/:id`**
- Method: DELETE
- Authorization: Bearer <JWT_TOKEN> (only for vendor)
- response body:
```json
{
	"status": "ok",
	"data": {
		"message": "Product deleted successfully"
	}
}
```
| Role   | Can Upload Products | Can See All Products | Can Manage Users |
| ------ | ------------------- | -------------------- | ---------------- |
| vendor | ✅                   | ❌ (only own)         | ❌                |
| admin  | ❌                   | ✅                    | ✅ (optional)     |
| user   | ❌                   | ✅                    | ❌                |

**Note:**
- if you can't use it npm run migrate or other sequelize commands, you can use `npx sequelize-cli` instead.