export const getPage = async (url, tokenName) => {
    return await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem(tokenName)}`
        }
    })
        .then(response => response.json())
}

export const detectLocalStorage = async (tokenName, detectAuthUrl) => {
    if (localStorage.getItem(tokenName)) {
        await fetch(detectAuthUrl, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem(tokenName)}`
            }
        }).then(response => {
                if (response.statusCode === 200) {
                    this.setState({auth: true})
                }
            })
    }
};


export function onChangeProperties(e) {
    const target = e.target
    this.setState({
        form: {
            ...this.state.form,
            fname: target.name === 'firstname' ? target.value.toLowerCase() : this.state.form.fname,
            lname: target.name === 'lastname' ? target.value.toLowerCase() : this.state.form.lname,
            login: target.name === 'login' ? target.value.toLowerCase() : this.state.form.login,
            password: target.name === 'password' ? target.value.toLowerCase() : this.state.form.password,
        }
    })
}

